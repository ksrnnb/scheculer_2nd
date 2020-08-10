<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ScheduleTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->browse(function (Browser $browser) {

            // check input error
            $browser->visit('/')
                    ->clickAtXPath('//td[contains(@data-date, "14")]')
                    ->clickAtXPath('//td[contains(@data-date, "15")]')
                    ->clickAtXPath('//td[contains(@data-date, "16")]')
                    ->press('Create')
                    ->assertPathIs('/');

            // create schedule
            $browser->type('scheduleName', 'test')
                    ->press('Create')
                    ->assertPathIs('/add');

            // add user
            $browser->type('userName', 'test_user')
                    ->press('Add user')
                    ->assertSee('test_user')
                    ->type('userName', 'test_user2')
                    ->press('Add user')
                    ->assertSee('test_user2');

            // update schedule name
            $browser->clickLink('test')
                    ->type('scheduleName', 'test2')
                    ->press('Update')
                    ->assertSee('Schedule name has changed.');

            // delete schedule
            $browser->clickLink('test')
                    ->press('Delete')
                    ->assertSee('Schedule has deleted.')
                    ->clickLink('Scheduler');



        });
    }
}